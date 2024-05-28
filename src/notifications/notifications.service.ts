import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Expo, ExpoPushTicket, ExpoPushErrorReceipt } from 'expo-server-sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationType } from '@prisma/client';

type Message = {
  to: string;
  body: string;
  data?: any;
  title?: string;
  sound?: any;
};

//needed fix to access ticket.id
type Ticket = ExpoPushTicket & {
  id?: string;
};
@Injectable()
export class NotificationsService {
  expo: Expo;
  private messages: Message[];
  private tickets: Ticket[];

  constructor(private readonly prisma: PrismaService) {
    this.expo = new Expo();
    this.messages = [];
    this.tickets = [];
  }

  public async sendNotificationToUser(
    userId: string,
    notificationType: NotificationType,
    body: string,
    title: string,
    extraData: any,
  ) {
    const tokensData = await this.prisma.pushToken.findMany({
      where: { userId },
    });

    await this.prisma.notification.create({
      data: { type: notificationType, body, title, userId, extraData },
    });

    for (const t of tokensData) {
      this.addNotificationToQueue(t.token, body, title, extraData);
    }
  }

  public async addNotificationToQueue(
    pushToken: string,
    body: string,
    title: string,
    data: any,
  ) {
    this.messages.push({
      to: pushToken,
      body,
      title,
      data,
      sound: 'default',
    });
  }

  public async removePushToken(token) {
    return this.prisma.pushToken.delete({
      where: {
        token,
      },
    });
  }

  public async addPushToken(userId: string, token: string) {
    return this.prisma.pushToken.upsert({
      where: {
        token,
      },
      create: { token, userId },
      update: { token, userId },
    });
  }

  @Cron('*/3 * * * * *')
  public async chunkPushNotifications() {
    const copy = this.messages;
    this.messages = [];

    this.expo.chunkPushNotifications(copy);

    // Temp disable chunking so AHW receives notifcations
    // make const chunk of chunks to chunk back chonky notifs
    for (const chunk of copy) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync([chunk]);

        this.tickets.push(...ticketChunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // we do handle tickets error in checkTickets
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    }
  }

  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async checkTickets() {
    const receiptIds = [];

    const copy = this.tickets;
    this.tickets = [];

    for (const ticket of copy) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      if (ticket.id) {
        receiptIds.push(ticket.id);
      } else if (ticket.status === 'error') {
        if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
          // https://github.com/expo/expo/issues/7795
          this.removePushToken(ticket.message.split(' ')[0].replace(/\"/g, ''));
        }

        console.log(
          'There was an error with notification ticket' +
            JSON.stringify(ticket),
        );
      }
    }

    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      try {
        const receipts =
          await this.expo.getPushNotificationReceiptsAsync(chunk);
        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (const receiptId in receipts) {
          const { status } = receipts[receiptId];

          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            const { message, details } = receipts[
              receiptId
            ] as ExpoPushErrorReceipt;

            console.error(
              `There was an error sending a notification: ${message}`,
            );
            if (details && details.error) {
              if (details.error === 'DeviceNotRegistered') {
                this.removePushToken(message.split(' ')[0].replace(/\"/g, ''));
              }
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
