import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/buttons/button_config.dart';
import 'package:frontend/components/atoms/buttons/primary_button.dart';
import 'package:frontend/components/atoms/card/active_card.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';

import 'text/body_text.dart';
import 'text/heading_text.dart';

class ProfileDetailCard extends StatelessWidget {
  final Map<String, String> data;
  const ProfileDetailCard({
    Key? key,
    required this.data,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ActiveCard(
      padding:  EdgeInsets.zero,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
           Padding(
            padding: const EdgeInsets.only(left: 32, right: 8, top: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                  Stack(
                alignment: Alignment.bottomRight,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircleAvatar(
                      radius: 45,
                      backgroundImage: NetworkImage(data['avatar']!),
                    ),
                  ),
                  Positioned(left: 75, top: 75, child: Image.asset("assets/images/green-tick.png", height: 25,)),
                ],
              ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      HeadingText(
                        text: data["name"]!,
                        fontColor: Colors.white,
                        fontSize: FontSizes.h4,
                      ),
                      BodyText(
                        text: data["title"]!,
                        fontColor: Colors.white,
                        fontSize: FontSizes.p3,
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              IconButton(
                  onPressed: () {},
                  icon: const Icon(
                    Icons.more_horiz,
                    size: 25,
                    color: Colors.white,
                  )),
              Padding(
                padding: const EdgeInsets.only(right: 32, bottom: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(bottom: 32),
                      child: PrimaryButton(
                        text: "Connection",
                        titleColor: secondaryBg,
                        onPressed: () {},
                        size: ButtonSize.sm,
                      ),
                    ),
                     Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Padding(
                              padding: EdgeInsets.all(3.0),
                              child: Icon(
                                Icons.star_border_outlined,
                                color: Colors.white70,
                                size: 18,
                              ),
                            ),
                            HeadingText(
                              text: "${data["total_reviews"]!} Reviews",
                              fontSize: FontSizes.p3,
                              fontColor: Colors.white70,
                            )
                          ],
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              const Padding(
                                padding: EdgeInsets.all(3.0),
                                child: Icon(
                                  Icons.people_outline,
                                  color: Colors.white70,
                                  size: 18,
                                ),
                              ),
                              HeadingText(
                                text: "${data["total_connections"]!} Connections ",
                                fontSize: FontSizes.p3,
                                fontColor: Colors.white70,
                              )
                            ],
                          ),
                        ),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Padding(
                              padding: EdgeInsets.all(3.0),
                              child: Icon(
                                Icons.verified,
                                color: Colors.white70,
                                size: 18,
                              ),
                            ),
                            HeadingText(
                              text: "Member Since ${data["created_at"]!}",
                              fontSize: FontSizes.p3,
                              fontColor: Colors.white70,
                            )
                          ],
                        )
                      ],
                    ),
                  ],
                ),
              )
            ],
          ),
        ],
      ),
    );
  }
}
