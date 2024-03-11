import 'package:flutter/material.dart';
import 'components/primary_button.dart';
import 'components/secondary_button.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              PrimaryButton(
                text: 'Get Started',
                onPressed: () {

                },
              ),
              const SizedBox(height: 20),
              SecondaryButton(
                text: 'See other options',
                onPressed: () {

                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}