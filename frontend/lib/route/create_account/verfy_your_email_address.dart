import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:frontend/components/atoms/buttons/primary_button.dart';
import 'package:frontend/components/atoms/buttons/secondary_button.dart';
import 'package:frontend/components/atoms/indicator/indicator.dart';
import 'package:frontend/components/atoms/text/body_text.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/components/atoms/text_field/primary_text_form_field.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';
import 'package:frontend/utils/screen_sizes.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:iconify_flutter/iconify_flutter.dart';

import 'package:colorful_iconify_flutter/icons/flat_color_icons.dart';

class VerfyYourEmail extends StatelessWidget {
  const VerfyYourEmail({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: isMobile(mediaQuery) ? 25 : 75, vertical: 25),
        child: Column(
          mainAxisAlignment:isMobile(mediaQuery)? MainAxisAlignment.start : MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: isMobile(mediaQuery) ? MainAxisAlignment.center : MainAxisAlignment.start,
                children: const [
                  HeadingText(text: "CULERO", fontSize: 25, fontColor: primaryBg),
                ],
              ),
            ),
            Expanded(
              child: SizedBox(
                width: 582,
                child: Column(
mainAxisAlignment:isMobile(mediaQuery)? MainAxisAlignment.start : MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    HeadingText(text: "Verify your email address", fontSize: isMobile(mediaQuery) ? FontSizes.h3 : FontSizes.h1),
                    Padding(
                      padding: EdgeInsets.symmetric(vertical: isMobile(mediaQuery) ? 20 : 25, horizontal: isMobile(mediaQuery) ? 25 : 0),
                      child: Column(
                        children: [
                          BodyText(text: "We've sent a verification code to Sarah.Harris24@gmail.com", textAlign: TextAlign.center, fontSize: isMobile(mediaQuery) ? FontSizes.p1 : FontSizes.h5),
                          GestureDetector(
                            onTap: () {},
                            child: Padding(
                              padding: EdgeInsets.symmetric(vertical: 8, horizontal: isMobile(mediaQuery) ? 25 : 0),
                              child: BodyText(text: "Not you?", textAlign: TextAlign.center, fontSize: isMobile(mediaQuery) ? FontSizes.p1 : FontSizes.h5),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(vertical: isMobile(mediaQuery) ? 20 : 25, horizontal: isMobile(mediaQuery) ? 25 : 0),
                      child: HeadingText(textAlign: TextAlign.center, text: "Please enter the code below to confirm your email address", fontSize: isMobile(mediaQuery) ? FontSizes.p1 : FontSizes.h5),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 25 ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(width: 72, height: 72, child: Padding(padding: const EdgeInsets.all(5), child: PrimaryTextFormField(maxLength: 1, hintText: "", onChanged: (e) {}))),
                          SizedBox(width: 72, height: 72, child: Padding(padding: const EdgeInsets.all(5), child: PrimaryTextFormField(maxLength: 1, hintText: "", onChanged: (e) {}))),
                          SizedBox(width: 72, height: 72, child: Padding(padding: const EdgeInsets.all(5), child: PrimaryTextFormField(maxLength: 1, hintText: "", onChanged: (e) {}))),
                          SizedBox(width: 72, height: 72, child: Padding(padding: const EdgeInsets.all(5), child: PrimaryTextFormField(maxLength: 1, hintText: "", onChanged: (e) {}))),
                          SizedBox(width: 72, height: 72, child: Padding(padding: const EdgeInsets.all(5), child: PrimaryTextFormField(maxLength: 1, hintText: "", onChanged: (e) {}))),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: TextButton(
                        onPressed: () => context.go("/emailverified"),
                        style: TextButton.styleFrom(
                          minimumSize: const Size(573, 60),
                          foregroundColor: textColor,
                          backgroundColor: primaryBg,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          elevation: 0,
                        ),
                        child: Text(
                          "Verfy Email",
                          style: GoogleFonts.inter(
                            textStyle: const TextStyle(fontWeight: FontWeight.bold, color: bodyText1, fontSize: 20),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text.rich(
                        textAlign: TextAlign.center,
                        TextSpan(
                          text: 'By continuing, you agree to Culero ',
                          children: [
                            TextSpan(
                              text: 'Terms of Service',
                              style: TextStyle(fontSize: isMobile(mediaQuery) ? FontSizes.p3 : FontSizes.p1, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic),
                            ),
                            const TextSpan(text: ' and '),
                            TextSpan(
                              text: 'Privacy Policy',
                              style: TextStyle(fontSize: isMobile(mediaQuery) ? FontSizes.p3 : FontSizes.p1, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic),
                            ),
                            const TextSpan(text: '.'),
                          ],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 30),
                      child: RichText(
                        text: TextSpan(
                          text: "Didn't receive the code?",
                          style: const TextStyle(
                            fontSize: FontSizes.p2, // Set text size to 17
                            color: Colors.black, // Default text color
                          ),
                          children: [
                            TextSpan(
                              text: 'Resend Code',
                              style: const TextStyle(
                                fontSize: FontSizes.p2, // Set text size to 17
                                color: Colors.blue, // Change color to blue for the link
                                fontWeight: FontWeight.bold,
                                decoration: TextDecoration.underline,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () {
                                  // Handle sign in action here
                                  // For example, you can navigate to the sign-in screen
                                  print('Sign in tapped');
                                },
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
