import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/components/atoms/text_field/search_text_field.dart';
import 'package:frontend/components/atoms/buttons/active_button.dart';
import 'package:frontend/components/atoms/buttons/text_button.dart';
import 'package:frontend/utils/color.dart';

final _controller = TextEditingController();

class LandingPage extends StatelessWidget {
  const LandingPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: MediaQuery.of(context).size.width,
        margin: const EdgeInsets.all(18),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                   const Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                     children: [
                       HeadingText(text: "CULERO", fontColor: secondaryBg),
                     ],
                   ),
                  Row(
                    children: [
                      SizedBox(width: 300, child: SearchTextField(controller: _controller, hintText: "Search by name or skills")),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TextButtonAtm(
                            onPressed: () {},
                            text: "Sign in/Sign up",
                          ),
                          ActiveButton(text: "Write Review", onPressed: () {})
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const Divider(
              color: Colors.black38,
            )
          ],
        ),
      ),
    );
  }
}
