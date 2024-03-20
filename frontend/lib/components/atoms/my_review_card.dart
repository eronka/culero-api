import 'package:flutter/material.dart';
import 'package:frontend/components/atoms/card/secondary_card.dart';

class MyReviewCard extends StatelessWidget {
  final Map<String, dynamic> data;
  const MyReviewCard({Key? key, required this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SecondaryCard(
      child: Column(
        children: [
          Row(
            children: [],
          ),
        ],
      ),
    );
  }
}
