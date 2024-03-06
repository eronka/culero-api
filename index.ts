import { Prisma, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function createSampleData() {
    const user1 = await prisma.user.create({
      data: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        profilePicture: "https://example.com/johndoe.jpg",
        jobTitle: "Software Engineer",
      },
    });
  
    const user2 = await prisma.user.create({
      data: {
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        profilePicture: "https://example.com/janedoe.jpg",
        jobTitle: "Product Manager",
      },
    });
  
    const review = await prisma.review.create({
      data: {
        authorId: user1.id,
        recipientId: user2.id,
        professionalism: 5,
        reliability: 5,
        communication: 5,
        comment: "Excellent collaboration!",
      },
    });
  
    const connection = await prisma.connection.create({
      data: {
        followerId: user1.id,
        followingId: user2.id,
      },
    });
  
    const linkedSocialAccount1 = await prisma.linkedSocialAccount.create({
      data: {
        userId: user1.id,
        platform: "LinkedIn",
        isConnected: true,
        profileUrl: "https://linkedin.com/in/johndoe",
      },
    });
  
    const linkedSocialAccount2 = await prisma.linkedSocialAccount.create({
      data: {
        userId: user2.id,
        platform: "LinkedIn",
        isConnected: true,
        profileUrl: "https://linkedin.com/in/janedoe",
      },
    });
  
    console.log({ user1, user2, review, connection, linkedSocialAccount1, linkedSocialAccount2 });
  }
  


  async function readSampleData() {
    const users = await prisma.user.findMany({
      include: {
        reviews: true,
        receivedReviews: true,
        connections: true,
        followedConnections: true,
        LinkedSocialAccount: true,
      },
    });
  
    console.dir(users, { depth: null });
  };

  (async () => {
    try {
      await createSampleData();
      await readSampleData();
    } catch (error) {
      console.log(error);
    }
  })();
