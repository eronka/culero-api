import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/text/body_text.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/utils/font_size.dart';

class NeedReviewTile extends StatelessWidget {
  final Map<String,String> data;
  const NeedReviewTile({Key? key, required this.data,}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      tileColor: Colors.white,
      leading:  CircleAvatar(
        radius: 20,
        backgroundImage: NetworkImage(data['avatar']!),
      ),
      title:  HeadingText(text: data['name']!, fontSize: FontSizes.p2),
      subtitle: BodyText(text: data['title']!, fontSize: FontSizes.p2),
      trailing: IconButton(onPressed: () {}, icon: const Icon(Icons.rate_review_outlined), iconSize: 30),
    );
  }
}
