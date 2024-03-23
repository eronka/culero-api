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

final TextEditingController controllerEmail = TextEditingController();
final TextEditingController controllerPass = TextEditingController();

class CreateYourAccountEmail extends StatefulWidget {
  const CreateYourAccountEmail({Key? key}) : super(key: key);

  @override
  State<CreateYourAccountEmail> createState() => _CreateYourAccountEmailState();
}

class _CreateYourAccountEmailState extends State<CreateYourAccountEmail> {
  final TextEditingController controllerEmail = TextEditingController();
  final TextEditingController controllerPass = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String passWord = "";
  @override
  void dispose() {
    controllerEmail.dispose();
    controllerPass.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: isMobile(mediaQuery) ? 25 : 75, vertical: 25),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      HeadingText(text: "Create your account", fontSize: isMobile(mediaQuery) ? FontSizes.h3 : FontSizes.h1),
                      Padding(
                        padding: EdgeInsets.symmetric(vertical: isMobile(mediaQuery) ? 50 : 25, horizontal: isMobile(mediaQuery) ? 25 : 0),
                        child: BodyText(text: "Embark on a Journey of Professional Growth and Collaboration!", textAlign: TextAlign.center, fontSize: isMobile(mediaQuery) ? FontSizes.p1 : FontSizes.h5),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: PrimaryTextFormField(
                          hintText: "Enter your email address",
                          controller: controllerEmail,
                          onChanged: (e) {},
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your email';
                            }
                            final RegExp emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');

                            if (!emailRegex.hasMatch(value)) {
                              return "Enter valid email";
                            }
                            return null;
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: PrimaryTextFormField(
                          hintText: "Create a password ",
                          controller: controllerPass,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter a password';
                            }
                            if (value.length < 8) {
                              return 'Password must be at least 8 characters long';
                            }
                            return null;
                          },
                          onChanged: (e) {
                            setState(() {
                              passWord = e;
                            });
                          },
                        ),
                      ),
                      (passWord.isNotEmpty)
                          ? Indicator(
                              value: passWord.length / 8,
                              color: passWord.length < 8 ? Colors.red : Colors.green,
                            )
                          : const SizedBox(height: 9),
                      if (passWord.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8, bottom: 50),
                          child: RichText(
                            text: TextSpan(
                              text: 'Password strength: ${passWord.length < 8 ? "Weak" : "Strong"}',
                              style: const TextStyle(
                                fontSize: FontSizes.h5,
                                fontWeight: FontWeight.bold,
                                fontStyle: FontStyle.italic,
                                color: Colors.black,
                              ),
                              children: const [
                                TextSpan(
                                  text: 'Try lengthening it or adding numbers and symbols.',
                                  style: TextStyle(
                                    fontSize: FontSizes.p3,
                                    fontWeight: FontWeight.normal,
                                    fontStyle: FontStyle.normal,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextButton(
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              context.go("/verfyemail");
                            }
                          },
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
                            "Get Started",
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
                            text: 'Have an account already? ',
                            style: const TextStyle(
                              fontSize: FontSizes.p2, // Set text size to 17
                              color: Colors.black, // Default text color
                            ),
                            children: [
                              TextSpan(
                                text: 'Sign in',
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
              ),
            )
          ],
        ),
      ),
    );
  }
}
