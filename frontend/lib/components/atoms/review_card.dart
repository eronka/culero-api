import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:frontend/components/atoms/card/secondary_card.dart';
import 'package:frontend/components/atoms/text/body_text.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';

import 'text/heading_text.dart';

class ReviewCard extends StatelessWidget {
  final Map<String, dynamic> data;

  const ReviewCard({Key? key, required this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SecondaryCard(
      border: false,
     
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: CircleAvatar(
                        radius: 20,
                        backgroundImage: NetworkImage(data['avatar']!),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              HeadingText(
                                text: data["over_all"].toString(),
                                fontSize: 24,
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 4),
                                child: HeadingText(
                                  text: "/",
                                  fontSize: 13,
                                ),
                              ),
                              const HeadingText(
                                text: "5",
                                fontSize: 13,
                              )
                            ],
                          ),
                          Row(
                            children: List.generate(
                              data['star_rating'],
                              (index) => const Padding(
                                padding: EdgeInsets.all(2.0),
                                child: Icon(
                                  Icons.star_rate,
                                  size: 16,
                                  color: primaryBg,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.favorite_border_outlined),
                  iconSize: 30,
                ),
              )
            ],
          ),
          const Divider(),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: BodyText(
                  text: "Review:",
                  fontSize: FontSizes.p2,
                ),
              ),
              Flexible(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: HeadingText(
                    text: data["review"],
                    fontSize: FontSizes.p2,
                  ),
                ),
              )
            ],
          ),
          const Divider(),
           Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Column(
                  children: [
                    const HeadingText(
                      text: "Professionalism",
                      fontColor: bodyText2,
                      fontSize: FontSizes.p2,
                    ),
                    HeadingText(
                      text: data['Professionalism'].toString(),
                      fontSize: FontSizes.h2,
                    )
                  ],
                ),
                Column(
                  children: [
                    const HeadingText(
                      text: "Reliability",
                      fontColor: bodyText2,
                      fontSize: FontSizes.p2,
                    ),
                    HeadingText(
                      text: data['Reliability'].toString(),
                      fontSize: FontSizes.h2,
                    )
                  ],
                ),
                Column(
                  children: [
                    const HeadingText(
                      text: "Communication",
                      fontColor: bodyText2,
                      fontSize: FontSizes.p2,
                    ),
                    HeadingText(
                      text: data['Communication'].toString(),
                      fontSize: FontSizes.h2,
                    )
                  ],
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
