import * as brain from 'brain.js';
import { data } from './data/data';

const maxAge = Math.max(...data.map(player => player.Age));

// Normalize data and include age as a feature
const normalizedData = data.map(player => {
  return {
    input: [
      player.PTS / player.Min, // Points per minute
      player.GP / 82, // Games played
      player.Age / maxAge, // Age, normalized
    ],
    output: [player.PTS / player.Min] // Points per minute
  };
});

// Split data into training and testing sets
const trainingData = normalizedData.slice(0, Math.floor(normalizedData.length * 0.8));
const testingData = normalizedData.slice(Math.floor(normalizedData.length * 0.8));

// Create a network
let net = new brain.recurrent.LSTM();

// Train the network
console.log(`Training network...`);
net.train(trainingData, { iterations: 2000, logPeriod: 100 });

// Test the network
testingData.forEach((data, i) => {
  const output = net.run(data.input);
  console.log(`Test ${i + 1}: expected ${data.output[0]}, got ${output}`);
});
// New code to analyze the influence of age...

// Choose a player's stats to use as a base
const basePlayer = data[0];

// Vary the age and observe the predicted points per game
for (let age = 18; age <= 40; age++) {
  const normalizedInput = [
    basePlayer.FGM / basePlayer.FGA, // Field goal percentage
    basePlayer['3PM'] / basePlayer['3PA'], // Three-point percentage
    basePlayer.FTM / basePlayer.FTA, // Free throw percentage
    age / maxAge, // Age, normalized
  ];
  const output = net.run(normalizedInput);
  console.log(`Age ${age}: predicted points per game ${output}`);
}