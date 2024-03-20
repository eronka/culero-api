import 'package:flutter/material.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';


class SearchTextField extends StatelessWidget {
  final Color backgroundColor;
  final String hintText;
  final TextEditingController controller;
  final VoidCallback? onTap;
  final void Function(String)? onChanged;
  final void Function(String)? onSubmitted;
  final VoidCallback? onSuffixTap;
  final Iterable<Widget>? trailing;

  const SearchTextField({
    Key? key,
    required this.controller,
    required this.hintText,
    this.backgroundColor = searchTextFieldBgColor,
    this.onTap,
    this.onChanged,
    this.onSubmitted,
    this.onSuffixTap,
    this.trailing,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SearchBar(
      hintText: hintText,
      trailing: trailing,
      side: const MaterialStatePropertyAll<BorderSide>(BorderSide(color: primaryBg)),
      elevation: const MaterialStatePropertyAll<double>(0),
      textStyle: const MaterialStatePropertyAll<TextStyle>(TextStyle(fontSize: FontSizes.h4)),
      hintStyle: const MaterialStatePropertyAll<TextStyle>(TextStyle(fontStyle: FontStyle.italic, fontSize: FontSizes.h4, color: placehoderText)),
      backgroundColor: MaterialStatePropertyAll<Color>(backgroundColor),
      padding: const MaterialStatePropertyAll<EdgeInsets>(EdgeInsets.symmetric(horizontal: 16.0)),
      leading: const Icon(Icons.search, color: placehoderText),
      onTap: onTap,
      onChanged: onChanged,
      onSubmitted: onSubmitted,
      controller:controller ,

    );
  }
}
