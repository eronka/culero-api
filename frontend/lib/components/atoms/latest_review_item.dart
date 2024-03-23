import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';

class LatestReviewItem extends StatelessWidget {
  final Map<String, dynamic> data;
  const LatestReviewItem({Key? key, required this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 400,
      height: 418,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: Colors.white,
      ),
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(onPressed: () {}, icon: const Icon(Icons.more_horiz, color: bgColor)),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: CircleAvatar(
              radius: 25,
              backgroundImage: NetworkImage(data['avatar']!),
            ),
          ),
          HeadingText(text: data["name"], fontSize: FontSizes.p2),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              data['star_rating'],
              (index) => const Padding(
                padding: EdgeInsets.all(2.0),
                child: Icon(Icons.star_rate, color: primaryBg),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: EdgeInsets.all(9.0),
                      child: HeadingText(text: "Professionalism", fontSize: FontSizes.p2, fontColor: bodyText2),
                    ),
                    Padding(
                      padding: EdgeInsets.all(9.0),
                      child: HeadingText(text: "Reliability", fontSize: FontSizes.p2, fontColor: bodyText2),
                    ),
                    Padding(
                      padding: EdgeInsets.all(9.0),
                      child: HeadingText(text: "Communication", fontSize: FontSizes.p2, fontColor: bodyText2),
                    ),
                  ],
                ),
                Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          HeadingText(
                            text: data["Professionalism"].toString(),
                            fontSize: FontSizes.p1,
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
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          HeadingText(
                            text: data["Reliability"].toString(),
                            fontSize: FontSizes.p1,
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
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          HeadingText(
                            text: data["Communication"].toString(),
                            fontSize: FontSizes.p1,
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
                    ),
                  ],
                )
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Divider(),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.all(12),
                child: IconButton(
                    onPressed: () {},
                    icon: const Icon(
                      Icons.favorite_border,
                      size: 35,
                    )),
              ),
              Padding(
                padding: const EdgeInsets.all(12),
                child: IconButton(
                    onPressed: () {},
                    icon: const Icon(
                      Icons.rate_review_outlined,
                      size: 35,
                    )),
              )
            ],
          )
        ],
      ),
    );
  }
}
