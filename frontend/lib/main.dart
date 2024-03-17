import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/Text/body_text.dart';
import 'package:frontend/components/atoms/Text/heading_text.dart';
import 'package:frontend/components/atoms/TextField/primary_text_form_field.dart';
import 'package:frontend/components/atoms/TextField/search_text_field.dart';
import 'package:frontend/components/atoms/buttons/primary_button.dart';
import 'package:frontend/components/atoms/buttons/secondary_button.dart';
import 'package:frontend/components/atoms/card/primary_card.dart';
import 'package:frontend/components/atoms/indicator/indicator.dart';
import 'package:frontend/utils/font_size.dart';

void main() {
  runApp(const MyApp());
}

final controller = TextEditingController();
final controller2 = TextEditingController();

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      title: 'Culero',
      home: Scaffold(
        body: Container(
          height: MediaQuery.of(context).size.height,
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: PrimaryTextFormField(
                  hintText: 'Hint',
                  onChanged: (e) {},
                  controller: controller,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: SearchTextField(controller: controller2, hintText: "Search Here"),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Flexible(child: PrimaryButton(text: "PrimaryButton", onPressed: () {})),
                    Flexible(child: SecondaryButton(text: "SecondaryButton", onPressed: () {})),
                  ],
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: PrimaryCard(
                  child: Column(
                    children: [
                      Padding(
                        padding: EdgeInsets.all(8.0),
                        child: HeadingText(text: "Heading Text", fontSize: FontSizes.h1),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8.0),
                        child: HeadingText(text: "Heading Text", fontSize: FontSizes.h2),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8.0),
                        child: HeadingText(text: "Heading Text", fontSize: FontSizes.h3),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8.0),
                        child: HeadingText(text: "Heading Text", fontSize: FontSizes.h4),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8.0),
                        child: HeadingText(text: "Heading Text", fontSize: FontSizes.h5),
                      ),
                       Padding(
                        padding: EdgeInsets.all(8.0),
                        child: BodyText(text: "Body Text", fontSize: FontSizes.p1),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8.0),
                        child: BodyText(text: "Body Text", fontSize: FontSizes.p2),
                      ),
                       Padding(
                        padding: EdgeInsets.all(8.0),
                        child: BodyText(text: "Body Text", fontSize: FontSizes.p3),
                      )

                    ],
                  ),

                ),

              ),
              const Indicator(value  : 0.5, color: Colors.red,size: Size.fromHeight(50),)
            ],
          ),
        ),
      ),
    );
  }
}
