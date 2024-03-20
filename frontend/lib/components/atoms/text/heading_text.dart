import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';
import 'package:google_fonts/google_fonts.dart';

class HeadingText extends StatelessWidget {
  final String text;
  final double fontSize;
  final Color fontColor;
  final FontWeight fontWeight;
  final FontStyle fontStyle;
  const HeadingText({
    Key? key,
    required this.text,
    this.fontColor = textColor,
    this.fontSize = FontSizes.h3,
    this.fontWeight = FontWeight.w600,
    this.fontStyle = FontStyle.normal,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      softWrap: true,
      style: GoogleFonts.inter(
        textStyle: TextStyle(
          color: fontColor,
          fontStyle: fontStyle,
          fontSize: fontSize,
          fontWeight: fontWeight,
        ),
      ),
    );
  }
}
