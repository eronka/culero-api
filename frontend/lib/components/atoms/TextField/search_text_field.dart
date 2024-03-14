import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/TextField/text_field_config.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';

class SearchTextField extends StatelessWidget {
  final bool bordered;
  final Color? backgroundColor;
  final Widget prefix;
  final double? borderRadius;
  final Color? borderColor;
  final String? placehoder;
  final TextEditingController controller;
  final VoidCallback? onTap;
  final void Function(String)? onChanged;
  final void Function(String)? onSubmitted;
  final VoidCallback? onSuffixTap;
  final TextInputType keyboardType;

  const SearchTextField({
    Key? key,
    required this.controller,
    this.bordered = true,
    this.backgroundColor,
    this.borderColor,
    this.borderRadius,
    this.placehoder,
    this.prefix = const Icon(CupertinoIcons.search),
    this.onTap,
    this.onChanged,
    this.onSubmitted,
    this.onSuffixTap,
    this.keyboardType = TextInputType.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CupertinoSearchTextField(
      controller: controller,
      onChanged: onChanged,
      onSuffixTap: onSuffixTap,
      onSubmitted: onSubmitted,
      onTap: onTap,
      prefixIcon: prefix,
      prefixInsets: const EdgeInsets.symmetric(horizontal: 16),
      suffixInsets: const EdgeInsets.symmetric(horizontal: 16),
      placeholderStyle: const TextStyle(
        fontStyle: FontStyle.italic,
        fontSize: FontSizes.h4,
        color: placehoderText,
      ),
      style: const TextStyle(
        fontSize: FontSizes.h4,
      ),
      itemColor: Colors.black,
      decoration: BoxDecoration(
        border: Border.all(color: primaryBg),
        borderRadius: const BorderRadius.all(Radius.circular(TextFieldBorderRadius.full)),
      ),
    );
  }
}
