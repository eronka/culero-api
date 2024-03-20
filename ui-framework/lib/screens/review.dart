import 'package:flutter/material.dart';
import 'package:ui_framwork/components/colors.dart';
import 'package:ui_framwork/components/review.dart';
import 'package:ui_framwork/components/write_review.dart';

class ReviewShowcase extends StatelessWidget {
  const ReviewShowcase({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Review'),
        backgroundColor: Colors.white,
      ),
      body: const Padding(
        padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 16),
        child: Column(
          children: [
            ReviewCard(
              reviewerName: 'Logan Davis',
              overallRating: 4.5,
              reviewText:
                  'What impressed me the most was Logan Davis\'s strategic thinking and the way they handled challenges. Their clear communication and willingness to listen to team members\' ideas created a positive and collaborative work environment.',
              categoryRatings: {
                'Professionalism': 4.7,
                'Reliability': 4.0,
                'Communication': 4.4,
              },
              postedDate: '01/28/2024',
              profileImageUrl:
                  'https://img.freepik.com/free-photo/woman-with-blond-short-hair-tanned-smiling-cute-gazing-camera-with-friendly_176420-44610.jpg',
            ),
            WriteReviewComponent()
          ],
        ),
      ),
      backgroundColor: mainBgColor,
    );
  }
}
