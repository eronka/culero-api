import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';

class Indicator extends StatelessWidget {
  final double? value;
  final Color color;
  final Size? size;
  final BorderRadius borderRadius;
  const Indicator({
    Key? key,
    this.color = primaryBg,
    this.size,
    this.value,
    this.borderRadius = const BorderRadius.all(Radius.circular(25)),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LinearProgressIndicator(
      value: value,
      backgroundColor: bgColor,
      valueColor: AlwaysStoppedAnimation<Color>(color),
      borderRadius: borderRadius,
    );
  }
}
