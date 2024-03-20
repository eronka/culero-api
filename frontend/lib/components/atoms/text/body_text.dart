import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';
import 'package:google_fonts/google_fonts.dart';

class BodyText extends StatelessWidget {
  final String text;
  final double fontSize;
  final Color fontColor;
  final FontWeight fontWeight;
  final FontStyle fontStyle;
  const BodyText({
    Key? key,
    required this.text,
    this.fontColor = bodyText1,
    this.fontSize = FontSizes.p1,
    this.fontWeight = FontWeight.normal,
    this.fontStyle = FontStyle.normal,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
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
