import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:ui_framwork/components/action_button.dart';
import 'package:ui_framwork/components/card.dart';
import 'package:ui_framwork/components/input.dart'; // Assuming you're using flutter_rating_bar for the star ratings

class WriteReviewComponent extends StatefulWidget {
  const WriteReviewComponent({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _WriteReviewComponentState createState() => _WriteReviewComponentState();
}

class _WriteReviewComponentState extends State<WriteReviewComponent> {
  double professionalismRating = 0;
  double reliabilityRating = 0;
  double communicationRating = 0;

  @override
  Widget build(BuildContext context) {
    return CustomCard(
        child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Text('Write Review',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        CustomInputField(
          hintText: 'Your review',
          controller:
              TextEditingController(), // You should manage the controller state appropriately
          keyboardType: TextInputType.multiline,
          obscureText:
              false, // Since it's a review, we don't want to obscure the text
        ),
        const SizedBox(height: 16),
        buildRatingRow('Professionalism', (rating) {
          setState(() {
            professionalismRating = rating;
          });
        }),
        buildRatingRow('Reliability', (rating) {
          setState(() {
            reliabilityRating = rating;
          });
        }),
        buildRatingRow('Communication', (rating) {
          setState(() {
            communicationRating = rating;
          });
        }),
        const SizedBox(height: 16),
        ActionButton(
            text: 'Submit Review',
            onPressed: () {
              // Submit review logic
            })
      ],
    ));
  }

  Widget buildRatingRow(String category, Function(double) onRatingUpdate) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(category, style: const TextStyle(fontSize: 16)),
        RatingBar.builder(
          initialRating: 0,
          minRating: 1,
          direction: Axis.horizontal,
          allowHalfRating: true,
          itemCount: 5,
          itemSize: 20.0,
          itemPadding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 5),
          itemBuilder: (context, _) =>
              const Icon(Icons.star, color: Color(0xffa1c0ff)),
          onRatingUpdate: onRatingUpdate,
        ),
      ],
    );
  }
}
