import 'package:flutter/material.dart';
import 'package:ui_framwork/components/colors.dart';
import 'package:google_fonts/google_fonts.dart';

class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color borderColor;
  final Color textColor;

  const SecondaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.borderColor = primaryTextColor,
    this.textColor = primaryTextColor,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: borderColor),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
      ),
      child: Text(
        text,
        style: GoogleFonts.inter(
          textStyle: TextStyle(color: textColor, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}