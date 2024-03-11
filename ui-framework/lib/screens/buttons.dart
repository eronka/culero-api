import 'package:flutter/material.dart';
import 'package:ui_framwork/components/primary_button.dart';
import 'package:ui_framwork/components/secondary_button.dart';

import '../components/config.dart';

class ButtonShowcase extends StatelessWidget {
  const ButtonShowcase({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buttons')),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              PrimaryButton(
                text: 'Primary sm',
                size: ButtonSize.sm,
                onPressed: () {},
              ),
              const SizedBox(height: 40),
              SecondaryButton(
                text: 'Secondary sm',
                size: ButtonSize.sm,
                onPressed: () {},
              ),
              const SizedBox(height: 40),
              PrimaryButton(
                text: 'Primary md',
                onPressed: () {},
              ),
              const SizedBox(height: 40),
              SecondaryButton(
                text: 'Secondary md',
                onPressed: () {},
              ),
              const SizedBox(height: 40),
              PrimaryButton(
                text: 'Primary lg',
                size: ButtonSize.lg,
                onPressed: () {},
              ),
              const SizedBox(height: 40),
              SecondaryButton(
                text: 'Secondary lg',
                size: ButtonSize.lg,
                onPressed: () {},
              ),
            ],
          ),
        ),
      ),
      backgroundColor: Colors.white,
    );
  }
}
