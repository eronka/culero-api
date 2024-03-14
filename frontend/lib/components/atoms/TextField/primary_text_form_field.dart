import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';



// TODO: Refactoring
class PrimaryTextFormField extends StatelessWidget {
  const PrimaryTextFormField({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  TextFormField(
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
    );
  }
}
