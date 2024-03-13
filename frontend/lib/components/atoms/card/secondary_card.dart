
import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';

class SecondaryCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final bool border;
  const SecondaryCard({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(8),
    this.border = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding:padding ,
      decoration: BoxDecoration(
        color: secondaryCardBg,
        borderRadius: BorderRadius.circular(15),
        border: border ? Border.all(color: cardBorderColor, width: 1) : null,
      ),
    );
  }
}
