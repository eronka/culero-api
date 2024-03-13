import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/buttons/primary_button.dart';

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
      home: Scaffold(
        body: Container(
          width: 500,
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              PrimaryButton(text: "Primary", onPressed: () {}),
            ],
          ),
        ),
      ),
    );
  }
}
