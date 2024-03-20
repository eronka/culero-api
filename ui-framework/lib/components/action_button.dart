import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ui_framwork/components/colors.dart';
import 'package:ui_framwork/components/config.dart';

class ActionButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color color;
  final Color textColor;
  final ButtonSize size;

  const ActionButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.color = blue,
    this.textColor = Colors.white,
    this.size = ButtonSize.md,
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
            borderRadius: BorderRadius.circular(10.0),
          ),
          elevation: 0,
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(
            textStyle: TextStyle(color: textColor, fontWeight: FontWeight.w500),
          ),
        ),
      ),
    );
  }
}
