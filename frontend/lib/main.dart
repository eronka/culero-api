import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/buttons/primary_button.dart';
import 'package:frontend/utils/color.dart';

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
        backgroundColor: bgColor,
        body: Container(
          width: 500,
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(
                height: 200,
                width: 200,
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: primaryCardBg,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: cardBorderColor, width: 1),
                  ),
                ),
              ),

              SizedBox(
                height: 200,
                width: 200,
                child: Container(

                  decoration: BoxDecoration(
                    color: activeCardBg,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: cardBorderColor, width: 1),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
