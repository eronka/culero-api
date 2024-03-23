import 'package:flutter/material.dart';
import 'package:frontend/page/landing_page.dart';

import 'page/create_account/create_your_account.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      title: 'Culero',
      home: const LandingPage(),
    );
  }
}
