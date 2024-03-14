import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/TextField/text_field_config.dart';
import 'package:frontend/components/atoms/buttons/primary_button.dart';
import 'package:frontend/utils/color.dart';
import 'package:flutter/cupertino.dart';

import 'utils/font_size.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      title: 'Culero',
      home: Scaffold(
        backgroundColor: bgColor,
        body: Container(
          width: 500,
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(
                height: 50,
                width: 300,
                child: CupertinoSearchTextField(
                  prefixInsets: const EdgeInsets.symmetric(horizontal: 16),
                  suffixInsets: const EdgeInsets.symmetric(horizontal: 16),
                  placeholderStyle: const TextStyle(
                    fontStyle: FontStyle.italic,
                    fontSize: FontSizes.h4,
                    color: placehoderText,
                  ),
                  style: const TextStyle(
                    fontSize: FontSizes.h4,
                  ),
                  itemColor: Colors.black,
                  decoration: BoxDecoration(
                    border: Border.all(color: primaryBg),
                    borderRadius: const BorderRadius.all(Radius.circular(TextFieldBorderRadius.full)),
                  ),
                ),
              ),

            ],
          ),
        ),
      ),
    );
  }
}
