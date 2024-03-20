import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

class CustomInputField extends StatelessWidget {
  final String hintText;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool obscureText;

  const CustomInputField({
    super.key,
    required this.hintText,
    required this.controller,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      style: GoogleFonts.inter(fontWeight: FontWeight.bold),
      decoration: InputDecoration(
        filled: true,
        fillColor: grayLight,
        hintText: hintText,
        hintStyle: GoogleFonts.inter(
          fontStyle: FontStyle.italic,
          color: primaryTextColor,
          fontWeight: FontWeight.w300,
        ),
        isDense: true,
        contentPadding: const EdgeInsets.fromLTRB(15, 30, 30, 0),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15.0),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
