import 'package:flutter/material.dart';
import 'package:ui_framwork/components/typography.dart';

class TypographyShowcase extends StatelessWidget {
  const TypographyShowcase({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Typography')),
       body: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Typographyx(title: "Heading", description: "Description"),
            ],
          ),
        ),
        backgroundColor: Colors.white,
    );
  }
}
