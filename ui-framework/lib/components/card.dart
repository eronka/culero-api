import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {
  const CustomCard(
      {super.key, required this.child, this.height, this.width, this.redius});
  final Widget child;
  final double? height;
  final double? width;
  final double? redius;
@override
Widget build(BuildContext context) {
  return Container(
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.all(
        Radius.circular(redius ?? 16),
      ),
    ),
    margin: const EdgeInsets.all(5.0),
    padding: const EdgeInsets.all(16.0), // Add padding here
    width: double.infinity, // Make width 100% of the parent
    child: child,
  );
}
}