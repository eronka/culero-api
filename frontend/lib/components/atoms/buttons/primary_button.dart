import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:frontend/utils/color.dart';

import 'button_config.dart';

class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color color;
  final Color titleColor;
  final ButtonSize size;

  final double radius;

  const PrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.color = primaryBg,
    this.titleColor = textColor,
    this.size = ButtonSize.md,
    this.radius = ButtonRadius.medium,
  });

  double _buttonHeight(ButtonSize size) {
    switch (size) {
      case ButtonSize.sm:
        return 40.0;
      case ButtonSize.md:
        return 50.0;
      case ButtonSize.lg:
        return 60.0;
      default:
        return 50.0;
    }
  }

  TextStyle _titleStyle(Color textColor, ButtonSize size) {
    switch (size) {
      case ButtonSize.sm:
        return TextStyle(fontWeight: FontWeight.w300, color: textColor, fontSize: 14);

      case ButtonSize.md:
        return TextStyle(fontWeight: FontWeight.w400, color: textColor, fontSize: 18);

      case ButtonSize.lg:
        return TextStyle(fontWeight: FontWeight.w500, color: textColor, fontSize: 20);

      default:
        return TextStyle(fontWeight: FontWeight.w400, color: textColor, fontSize: 18);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: _buttonHeight(size),
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          foregroundColor: textColor,
          backgroundColor: color,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radius),
          ),
          elevation: 0,
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(
            textStyle: _titleStyle(textColor, size),
          ),
        ),
      ),
    );
  }
}
