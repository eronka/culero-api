import 'package:flutter/material.dart';
import 'package:ui_framwork/components/input.dart';
import 'package:ui_framwork/components/primary_button.dart';
import 'package:ui_framwork/components/secondary_button.dart';

class InputShowcase extends StatelessWidget {
  const InputShowcase({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Input')),
       body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16),
          child: Column(
            children: [
              CustomInputField(
                hintText: 'Email',
                controller: TextEditingController(),
              ),
            ],
          ),
        ),
        backgroundColor: Colors.white,
    );
  }
}
