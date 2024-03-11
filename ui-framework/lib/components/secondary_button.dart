import 'package:flutter/material.dart';
import 'package:ui_framwork/components/colors.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ui_framwork/components/config.dart';

class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color borderColor;
  final Color textColor;
  final ButtonSize size;

  const SecondaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.borderColor = primaryTextColor,
    this.textColor = primaryTextColor,
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
          backgroundColor: Colors
              .transparent, 
          side: BorderSide(color: borderColor),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
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
