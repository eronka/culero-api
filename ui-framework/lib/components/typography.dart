import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

class Typographyx extends StatelessWidget {
  final String title;
  final String description;

  const Typographyx({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topLeft,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              textStyle: const TextStyle(
                color: primaryTextColor,
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 8.0),
          Text(
            description,
            style: GoogleFonts.inter(
              textStyle: const TextStyle(
                color: primaryTextColor,
                fontSize: 16.0,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
