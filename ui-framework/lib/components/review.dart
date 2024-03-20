import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart'; // Import flutter_svg
import 'package:ui_framwork/icons/love.dart';
import 'card.dart'; // Assuming CustomCard is in this file

class ReviewCard extends StatelessWidget {
  final String reviewerName;
  final double overallRating;
  final String reviewText;
  final Map<String, double> categoryRatings;
  final String postedDate;
  final String profileImageUrl; // Parameter for the profile image URL

  const ReviewCard({
    super.key,
    required this.reviewerName,
    required this.overallRating,
    required this.reviewText,
    required this.categoryRatings,
    required this.postedDate,
    required this.profileImageUrl, // Require the profile image URL
  });

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(profileImageUrl),
                  radius: 22, // Adjusted for visual match
                ),
                const SizedBox(
                    width: 8), // Add space between the avatar and the rating
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: '$overallRating ',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                            const WidgetSpan(
                              child: Text(
                                '/ 5',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: List.generate(5, (index) {
                          return Icon(
                            index < overallRating.floor() ? Icons.star : index < overallRating ? Icons.star_half : Icons.star_border,
                            color: index < overallRating ? const Color(0xffa1c0ff) : Colors.grey[400],
                            size: 20,
                          );
                        }),
                      ),
                    ],
                  ),
                ),
                SvgPicture.string(
                  loveIcon,
                  width: 16, // Set your desired width
                  height: 16, // Set your desired height
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text('Review:',
                style: TextStyle(fontWeight: FontWeight.bold)),
            Text(reviewText),
            const SizedBox(height: 8),
            ...categoryRatings.entries.map(
              (entry) => Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    entry.key,
                    style: const TextStyle(
                        fontWeight:
                            FontWeight.w600), // Semi-bold for the category name
                  ),
                  Text(
                    '${entry.value.toString()} / 5',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold), // Bold for the score
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text('Posted on: $postedDate'),
          ],
        ),
      ),
    );
  }
}
