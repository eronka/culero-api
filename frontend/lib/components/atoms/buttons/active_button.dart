import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:frontend/utils/color.dart';

import 'button_config.dart';

class ActiveButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color color;
  final Color titleColor;
  final ButtonSize size;
  final double? width;

  final double radius;

  const ActiveButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.color = secondaryBg,
    this.titleColor = Colors.white,
    this.size = ButtonSize.md,
    this.radius = ButtonRadius.medium,
    this.width,
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

  TextStyle _titleStyle(Color titleColor, ButtonSize size) {
    switch (size) {
      case ButtonSize.sm:
        return TextStyle(fontWeight: FontWeight.w300, color: titleColor, fontSize: 14);

      case ButtonSize.md:
        return TextStyle(fontWeight: FontWeight.w400, color: titleColor, fontSize: 18);

      case ButtonSize.lg:
        return TextStyle(fontWeight: FontWeight.w500, color: titleColor, fontSize: 20);

      default:
        return TextStyle(fontWeight: FontWeight.w400, color: titleColor, fontSize: 18);
    }
  }

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        fixedSize: width != null ? Size(width!, _buttonHeight(size)) : Size.fromHeight(_buttonHeight(size)),
        foregroundColor: titleColor,
        backgroundColor: color,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radius),
        ),
        elevation: 0,
      ),
      child: Text(
        text,
        style: GoogleFonts.inter(
          textStyle: _titleStyle(titleColor, size),
        ),
      ),
    );
  }
}
