import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/buttons/button_config.dart';
import 'package:frontend/components/atoms/card/secondary_card.dart';
import 'package:frontend/components/atoms/indicator/indicator.dart';
import 'package:frontend/components/atoms/text/body_text.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/components/atoms/text_field/search_text_field.dart';
import 'package:frontend/components/atoms/buttons/active_button.dart';
import 'package:frontend/components/atoms/buttons/text_button.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';

final _controller = TextEditingController();

class LandingPage extends StatelessWidget {
  const LandingPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          width: MediaQuery.of(context).size.width,
          margin: const EdgeInsets.all(18),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    const Flexible(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          HeadingText(text: "CULERO", fontColor: secondaryBg),
                        ],
                      ),
                    ),
                    Flexible(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          SizedBox(width: 300, child: SearchTextField(controller: _controller, hintText: "Search by name or skills")),
                        ],
                      ),
                    ),
                    Flexible(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButtonAtm(
                            onPressed: () {},
                            text: "Sign in/Sign up",
                          ),
                          ActiveButton(text: "Write Review", onPressed: () {})
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const Divider(color: Colors.black38),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 50),
                child: Row(
                  children: [
                    GestureDetector(
                      child: const BodyText(text: "About us", fontSize: FontSizes.h4),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 25),
                      child: GestureDetector(
                        child: const BodyText(text: "Contact us", fontSize: FontSizes.h4),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Flexible(
                      flex: 1,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 8),
                              child: HeadingText(text: "Welcome to Culero", fontColor: Colors.grey, fontSize: FontSizes.h1),
                            ),
                            const HeadingText(text: "Review, Reflect, Connect.", fontColor: secondaryBg, fontSize: 48),
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 30),
                              child: BodyText(text: "The new approach to bottom up management.", fontColor: bodyText1, fontSize: FontSizes.h2),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 30),
                              child: ActiveButton(text: "Get started today", onPressed: () {}, size: ButtonSize.lg, width: 430),
                            ),
                            const Padding(
                              padding: EdgeInsets.only(top: 40),
                              child: BodyText(text: "Have an account already? ", fontSize: FontSizes.p1),
                            ),
                            const BodyText(text: "Sign in", fontColor: secondaryBg, fontSize: FontSizes.p1)
                          ],
                        ),
                      ),
                    ),
                    Flexible(
                      flex: 1,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Stack(
                            clipBehavior: Clip.none,
                            alignment: AlignmentDirectional.topEnd,
                            children: [
                              const SecondaryCard(
                                borderColor: Colors.grey,
                                color: Colors.transparent,
                                child: SizedBox(height: 575, width: 494),
                              ),
                              Positioned(
                                top: 18,
                                right: 35,
                                child: SecondaryCard(
                                  height: 575,
                                  width: 494,
                                  border: false,
                                  padding: EdgeInsets.zero,
                                  child: Image.asset(
                                    "assets/images/landing_image.png",
                                    fit: BoxFit.fill,
                                  ),
                                ),
                              ),
                              Positioned(
                                right: 400,
                                top: 300,
                                child: Container(
                                  // width: 200,
                                  // height: 100,
                                  decoration: BoxDecoration(
                                    color: const Color.fromRGBO(241, 241, 241, 1),
                                    borderRadius: BorderRadius.circular(35),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        offset: const Offset(10, 10),
                                        blurRadius: 20,
                                      ),
                                    ],
                                  ),
                                  child: const Padding(
                                    padding: EdgeInsets.all(18.0),
                                    child: Center(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          HeadingText(text: "My Average Rating", fontSize: FontSizes.h5, fontColor: bodyText2),
                                          HeadingText(text: "4.5", fontSize: 48, fontColor: bodyText2),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                left: 250,
                                top: 450,
                                child: Container(
                                  width: 340,
                                  // height: 190,
                                  decoration: BoxDecoration(
                                    color: const Color.fromRGBO(241, 241, 241, 1),
                                    borderRadius: BorderRadius.circular(35),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        offset: const Offset(10, 10),
                                        blurRadius: 20,
                                      ),
                                    ],
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.symmetric(vertical: 5),
                                          child: Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                                            children: [
                                              const BodyText(text: "My Performance", fontSize: FontSizes.h5),
                                              Column(
                                                crossAxisAlignment: CrossAxisAlignment.end,
                                                children: [
                                                  const Padding(
                                                    padding: EdgeInsets.only(right: 8),
                                                    child: Row(
                                                      crossAxisAlignment: CrossAxisAlignment.baseline,
                                                      textBaseline: TextBaseline.alphabetic,
                                                      mainAxisAlignment: MainAxisAlignment.center,
                                                      children: [
                                                        HeadingText(
                                                          text: "4.8",
                                                          fontSize: FontSizes.h3,
                                                        ),
                                                        Padding(
                                                          padding: EdgeInsets.symmetric(horizontal: 4),
                                                          child: HeadingText(
                                                            text: "/",
                                                            fontSize: 13,
                                                          ),
                                                        ),
                                                        HeadingText(
                                                          text: "5",
                                                          fontSize: 13,
                                                        )
                                                      ],
                                                    ),
                                                  ),
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.center,
                                                    children: List.generate(
                                                      5,
                                                      (index) => const Padding(
                                                        padding: EdgeInsets.all(2.0),
                                                        child: Icon(Icons.star_rate, color: primaryBg, size: 12),
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              )
                                            ],
                                          ),
                                        ),
                                        const Padding(
                                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                                          child: Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                                            children: [
                                              Column(
                                                mainAxisSize: MainAxisSize.max,
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                children: [
                                                  Padding(
                                                    padding: EdgeInsets.all(8.0),
                                                    child: HeadingText(text: "Professionalism", fontSize: 13, fontColor: bodyText2),
                                                  ),
                                                  Padding(
                                                    padding: EdgeInsets.all(8.0),
                                                    child: HeadingText(text: "Reliability", fontSize: 13, fontColor: bodyText2),
                                                  ),
                                                  Padding(
                                                    padding: EdgeInsets.all(8.0),
                                                    child: HeadingText(text: "Communication", fontSize: 13, fontColor: bodyText2),
                                                  ),
                                                ],
                                              ),
                                              Column(
                                                mainAxisSize: MainAxisSize.max,
                                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                children: [
                                                  Padding(
                                                    padding: EdgeInsets.all(8),
                                                    child: SizedBox(
                                                      width: 150,
                                                      child: Indicator(
                                                        backgroundColor: Colors.transparent,
                                                        height: 20,
                                                        value: 3.5 / 5,
                                                      ),
                                                    ),
                                                  ),
                                                  Padding(
                                                    padding: EdgeInsets.all(8),
                                                    child: SizedBox(
                                                      width: 150,
                                                      child: Indicator(
                                                        backgroundColor: Colors.transparent,
                                                        height: 20,
                                                        value: 2 / 5,
                                                      ),
                                                    ),
                                                  ),
                                                  Padding(
                                                    padding: EdgeInsets.all(8),
                                                    child: SizedBox(
                                                      width: 150,
                                                      child: Indicator(
                                                        backgroundColor: Colors.transparent,
                                                        height: 20,
                                                        value: 5 / 5,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
               SizedBox(
                height: 483,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(bottom: 50),
                      child: HeadingText(text: "How It Works", fontColor: bodyText3, fontSize: 36),
                    ),
                    Container(
                      width: 910,
                      padding: const EdgeInsets.all(8.0),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Column(
                            children: [
                              Icon(Icons.person_2_outlined, size: 50, color: bodyText3),
                              Padding(
                                padding: EdgeInsets.all(16.0),
                                child: HeadingText(text: "Discover", fontSize: FontSizes.h5),
                              ),
                              SizedBox(
                                width: 220,
                                child: BodyText(
                                  text: "Take the time to self reflect & review the feedback people are leaving about you",
                                  fontSize: FontSizes.p3,
                                  textAlign: TextAlign.center,
                                ),
                              )
                            ],
                          ),
                           Column(
                            children: [
                              Icon(Icons.rate_review_outlined, size: 50, color: bodyText3),
                              Padding(
                                padding: EdgeInsets.all(16.0),
                                child: HeadingText(text: "Review others", fontSize: FontSizes.h5),
                              ),
                              SizedBox(
                                width: 220,
                                child: BodyText(
                                  text: "write reviews based on your experience & interactions.",
                                  fontSize: FontSizes.p3,
                                  textAlign: TextAlign.center,
                                ),
                              )
                            ],
                          ),
                           Column(
                            children: [
                              Icon(Icons.people_outline, size: 50, color: bodyText3),
                              Padding(
                                padding: EdgeInsets.all(16.0),
                                child: HeadingText(text: "Make better choices", fontSize: FontSizes.h5),
                              ),
                              SizedBox(
                                width: 220,
                                child: BodyText(
                                  text: "Use the platform to research peers before choosing to work with them.",
                                  fontSize: FontSizes.p3,
                                  textAlign: TextAlign.center,
                                ),
                              )
                            ],
                          ),

                        ],
                      ),
                    )
                  ],
                ),
              ),
              const Divider(),
 Padding(
   padding: const EdgeInsets.all(20.0),
   child: GestureDetector(
                        child: const BodyText(text: "Terms and Policy", fontSize: FontSizes.h4),
                      ),
 ),

            ],
          ),
        ),
      ),
    );
  }
}
