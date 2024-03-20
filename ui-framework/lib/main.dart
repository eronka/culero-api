import 'package:flutter/material.dart';
import 'package:ui_framwork/screens/buttons.dart';
import 'package:ui_framwork/screens/card.dart';
import 'package:ui_framwork/screens/home.dart';
import 'package:ui_framwork/screens/input.dart';
import 'package:ui_framwork/screens/review.dart';
import 'package:ui_framwork/screens/typography.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'Named Routes Demo',
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(), 
        '/buttons': (context) => const ButtonShowcase(),
        '/card': (context) => const CardShowcase(),
        '/typography': (context) => const TypographyShowcase(),
        '/input': (context) => const InputShowcase(),
        '/review': (context) => const ReviewShowcase(),
      },
    ),
  );
}

