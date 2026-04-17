/**
 * Draw Engine — Core logic for the GiveBack monthly draw system.
 * Generates winning numbers and calculates prize payouts.
 */

interface DrawEntry {
  user_id: string;
  scores: number[];
}

interface WinnerResult {
  user_id: string;
  match_count: number;
  payout_amount: number;
}

interface DrawResult {
  winningNumbers: number[];
  winners: WinnerResult[];
  jackpotRollover: number;
}

/**
 * Generate 5 unique winning numbers between 1 and 45.
 */
export function generateNumbers(
  mode: 'random' | 'algorithmic',
  entries: DrawEntry[]
): number[] {
  const numbers: number[] = [];

  if (mode === 'algorithmic' && entries.length > 0) {
    // Weighted by score frequency across all entries
    const frequency: Record<number, number> = {};
    entries.forEach(entry => {
      entry.scores.forEach(score => {
        frequency[score] = (frequency[score] || 0) + 1;
      });
    });

    // Sort by frequency (most common first) and pick top 5
    const sorted = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([num]) => parseInt(num));

    // Take unique numbers from sorted list
    for (const num of sorted) {
      if (numbers.length >= 5) break;
      if (!numbers.includes(num) && num >= 1 && num <= 45) {
        numbers.push(num);
      }
    }
  }

  // Fill remaining slots with random numbers
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
}

/**
 * Match entries against winning numbers.
 * Returns grouped results by match count (3, 4, 5).
 */
export function matchEntries(
  winningNumbers: number[],
  entries: DrawEntry[]
): Record<number, string[]> {
  const groups: Record<number, string[]> = { 3: [], 4: [], 5: [] };

  entries.forEach(entry => {
    const matchCount = entry.scores.filter(s => winningNumbers.includes(s)).length;
    if (matchCount >= 3) {
      groups[matchCount].push(entry.user_id);
    }
  });

  return groups;
}

/**
 * Calculate payouts based on pool size and matched groups.
 * Prize tiers:
 *   5 match → 40% of pool (jackpot)
 *   4 match → 35% of pool
 *   3 match → 25% of pool
 * 
 * If no 5-match winners, jackpot rolls over.
 */
export function calculatePayouts(
  pool: number,
  existingRollover: number,
  matchGroups: Record<number, string[]>
): DrawResult & { totalPool: number } {
  const totalPool = pool + existingRollover;
  
  const jackpotPool = totalPool * 0.40;
  const tier4Pool = totalPool * 0.35;
  const tier3Pool = totalPool * 0.25;

  const winners: WinnerResult[] = [];
  let jackpotRollover = 0;

  // 5-match: Jackpot
  if (matchGroups[5].length > 0) {
    const payout = jackpotPool / matchGroups[5].length;
    matchGroups[5].forEach(uid => {
      winners.push({ user_id: uid, match_count: 5, payout_amount: Math.round(payout * 100) / 100 });
    });
  } else {
    // No jackpot winner → rollover
    jackpotRollover = jackpotPool;
  }

  // 4-match
  if (matchGroups[4].length > 0) {
    const payout = tier4Pool / matchGroups[4].length;
    matchGroups[4].forEach(uid => {
      winners.push({ user_id: uid, match_count: 4, payout_amount: Math.round(payout * 100) / 100 });
    });
  }

  // 3-match
  if (matchGroups[3].length > 0) {
    const payout = tier3Pool / matchGroups[3].length;
    matchGroups[3].forEach(uid => {
      winners.push({ user_id: uid, match_count: 3, payout_amount: Math.round(payout * 100) / 100 });
    });
  }

  return {
    winningNumbers: [],
    winners,
    jackpotRollover,
    totalPool,
  };
}

/**
 * Run a complete draw: generate numbers, match entries, calculate payouts.
 */
export function runFullDraw(
  mode: 'random' | 'algorithmic',
  entries: DrawEntry[],
  pool: number,
  existingRollover: number = 0
): DrawResult {
  const winningNumbers = generateNumbers(mode, entries);
  const matchGroups = matchEntries(winningNumbers, entries);
  const { winners, jackpotRollover } = calculatePayouts(pool, existingRollover, matchGroups);

  return {
    winningNumbers,
    winners,
    jackpotRollover,
  };
}
