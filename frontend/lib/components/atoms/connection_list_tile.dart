import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/card/secondary_card.dart';
import 'package:frontend/components/atoms/text/body_text.dart';
import 'package:frontend/components/atoms/text/heading_text.dart';
import 'package:frontend/utils/font_size.dart';


class ConnectionListTile extends StatelessWidget {
  final Map<String, String> data;
  const ConnectionListTile({Key? key, required this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SecondaryCard(
      border: false,
      padding: const EdgeInsets.all(8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Stack(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: NetworkImage(data['avatar']!),
                  ),
                ],
              ),
               Padding(
                padding: const EdgeInsets.all(18.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    HeadingText(text: data["name"]!),
                    BodyText(
                      text:data["title"]!,
                      fontSize: FontSizes.p3,
                    )
                  ],
                ),
              )
            ],
          ),
          Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 32),
                child: Column(
                  children: [
                    IconButton(onPressed: () {}, icon: const Icon(Icons.message_outlined)),
                    const BodyText(text: "Write review"),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(18.0),
                    child: IconButton(onPressed: () {}, icon: const Icon(Icons.more_horiz_outlined)),
                  ),
                ],
              )
            ],
          ),
        ],
      ),
    );
  }
}
