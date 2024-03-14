import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/TextField/text_field_config.dart';
import 'package:frontend/utils/color.dart';
import 'package:frontend/utils/font_size.dart';
// TODO: Refactoring
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
    return SearchBar(
      hintText: "Search",
      trailing: [FilledButton(onPressed: () {}, child: const Text("Hello"))],
      side: const MaterialStatePropertyAll<BorderSide>(BorderSide(color: primaryBg)),
      elevation: const MaterialStatePropertyAll<double>(0),
      textStyle: const MaterialStatePropertyAll<TextStyle>(TextStyle(fontSize: FontSizes.h4)),
      hintStyle: const MaterialStatePropertyAll<TextStyle>(
        TextStyle(
          fontStyle: FontStyle.italic,
          fontSize: FontSizes.h4,
          color: placehoderText,
        ),
      ),
      backgroundColor: const MaterialStatePropertyAll<Color>(searchTextFieldBgColor),
      padding: const MaterialStatePropertyAll<EdgeInsets>(EdgeInsets.symmetric(horizontal: 16.0)),
      leading: const Icon(
        Icons.search,
        color: placehoderText,
      ),
    );
  }
}
