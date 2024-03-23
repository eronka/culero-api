import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/card/secondary_card.dart';
import 'package:frontend/components/atoms/indicator/indicator.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';

class MyReviewCard extends StatelessWidget {
  final Map<String, dynamic> data;
  const MyReviewCard({Key? key, required this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SecondaryCard(
      width: 500,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const HeadingText(
                text: "My Reviews",
                fontSize: FontSizes.h2,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        HeadingText(
                          text: data["Professionalism"].toString(),
                          fontSize: FontSizes.h2,
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
                ],
              )
            ],
          ),
          Row(
            children: [
              const Column(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: HeadingText(text: "Professionalism", fontSize: FontSizes.h5, fontColor: bodyText2),
                  ),
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: HeadingText(text: "Reliability", fontSize: FontSizes.h5, fontColor: bodyText2),
                  ),
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: HeadingText(text: "Communication", fontSize: FontSizes.h5, fontColor: bodyText2),
                  ),
                ],
              ),
              Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: SizedBox(
                      width: 200,
                      child: Indicator(
                        height: 20,
                        value: data["Professionalism"] ?? 0 / 5,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: SizedBox(
                      width: 200,
                      child: Indicator(
                        height: 20,
                        value: data["Reliability"] ?? 0 / 5,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: SizedBox(
                      width: 200,
                      child: Indicator(
                        height: 20,
                        value: data["Communication"] ?? 0 / 5,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
