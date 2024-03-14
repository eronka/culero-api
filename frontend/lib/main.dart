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
        body: Container(
          width: 500,
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [

              SearchBar(
                hintText: "Search",
                trailing: [FilledButton(onPressed: () {}, child: const Text("Hello"))],
                side: const MaterialStatePropertyAll<BorderSide>(BorderSide(color: primaryBg)),
                elevation: const MaterialStatePropertyAll<double>(0),
                textStyle: const MaterialStatePropertyAll<TextStyle>(TextStyle(fontSize: FontSizes.h4)),
                hintStyle: const MaterialStatePropertyAll<TextStyle>(
                  TextStyle(
                    fontStyle: FontStyle.italic,
                    fontSize: FontSizes.h4,
                    color: placehoderText,
                  ),
                ),
                backgroundColor: const MaterialStatePropertyAll<Color>(searchTextFieldBgColor),
                padding: const MaterialStatePropertyAll<EdgeInsets>(EdgeInsets.symmetric(horizontal: 16.0)),
                leading: const Icon(
                  Icons.search,
                  color: placehoderText,
                ),
              ),
              TextFormField(
                autofocus: true,
                cursorColor: placehoderText,
                cursorOpacityAnimates: true,
                style: const TextStyle(
                  fontSize: FontSizes.h4,
                ),
                decoration: const InputDecoration(
                  filled: true,
                  fillColor: bgColor,
                  alignLabelWithHint: true,
                  isDense: true,
                  hintText: "hint",
                  hintStyle: TextStyle(
                    fontStyle: FontStyle.italic,
                    fontSize: FontSizes.h4,
                    color: placehoderText,
                  ),
                  contentPadding: EdgeInsets.all(18),
                  border: OutlineInputBorder(borderSide: BorderSide.none),
                  focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: primaryBg)),
                  errorBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.red)),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
