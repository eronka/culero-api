import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';

class Indicator extends StatelessWidget {
  final double? value;
  final Color color;
  final Color backgroundColor;
  final double? height;
  final BorderRadius borderRadius;
  const Indicator({
    Key? key,
    this.color = primaryBg,
    this.backgroundColor= Colors.white,
    this.height,
    this.value,
    this.borderRadius = const BorderRadius.all(Radius.circular(25)),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LinearProgressIndicator(
      value: value,
      minHeight: height,

      backgroundColor: backgroundColor,
      valueColor: AlwaysStoppedAnimation<Color>(color),
      borderRadius: borderRadius,
    );
  }
}
