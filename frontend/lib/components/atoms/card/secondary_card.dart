import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';

class SecondaryCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final bool border;
  final double? height;
  final double? width;
  final Color? borderColor;
  final Color? color;
  const SecondaryCard({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(8),
    this.border = true,
    this.height,
    this.width,
    this.borderColor,
    this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? secondaryCardBg,
        borderRadius: BorderRadius.circular(15),
        border: border ? Border.all(color: borderColor ?? cardBorderColor, width: 1) : null,
      ),
      child: child,
    );
  }
}
