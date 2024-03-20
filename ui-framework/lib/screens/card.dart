import 'package:flutter/material.dart';
import 'package:ui_framwork/components/card.dart';
import 'package:ui_framwork/components/colors.dart';
import 'package:ui_framwork/components/typography.dart';


class CardShowcase extends StatelessWidget {
  const CardShowcase({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Card'), backgroundColor: Colors.white,),
       body: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 16),
          child: Column(
            children: [
              CustomCard(
                child: Typographyx(
                  title: "Heading",
                  description: "Description",
                ),
              )
            ],
          ),
        ),
        backgroundColor: mainBgColor,
    );
  }
}
