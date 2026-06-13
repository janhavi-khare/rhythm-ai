import pandas as pd
import numpy as np
import random

from engine.cycle_calculator import determine_phase

NUM_USERS = 250
ROWS_PER_USER = 20

data = []

def clamp(x, low, high):
    return max(low, min(high, x))

for user_id in range(NUM_USERS):

    cycle_length = random.choice([26,27,28,29,30,31])
    period_length = random.choice([3,4,5,6,7])

    user_type = np.random.choice(
        ["low_symptom","normal","high_symptom","pmdd"],
        p=[0.25,0.55,0.15,0.05]
    )

    for _ in range(ROWS_PER_USER):

        day = random.randint(1, cycle_length)

        phase = determine_phase(day, cycle_length, period_length)

        if phase == "Menstrual":
            energy = random.randint(1,3)
            mood = random.randint(2,4)
            bloating = random.randint(1,3)
            cravings = random.randint(1,3)

        elif phase == "Follicular":
            energy = random.randint(3,5)
            mood = random.randint(3,5)
            bloating = random.randint(0,1)
            cravings = random.randint(0,1)

        elif phase == "Ovulation":
            energy = random.randint(4,5)
            mood = random.randint(4,5)
            bloating = random.randint(0,1)
            cravings = random.randint(0,1)

        elif phase == "Early Luteal":
            energy = random.randint(2,4)
            mood = random.randint(2,4)
            bloating = random.randint(1,3)
            cravings = random.randint(1,3)

        elif phase == "Late Luteal":
            energy = random.randint(1,3)
            mood = random.randint(1,4)
            bloating = random.randint(2,5)
            cravings = random.randint(2,5)

        sleep = np.random.choice(
            [0,1,2],   # Poor, Average, Good
            p=[0.2,0.4,0.4]
        )

        # Sleep influences energy
        if sleep == 0:
            energy -= 1

        # User type modifiers
        if user_type == "low_symptom":
            bloating -= 1
            cravings -= 1

        elif user_type == "high_symptom":
            bloating += 1
            cravings += 1

        elif user_type == "pmdd" and phase == "Luteal":
            mood -= 2
            cravings += 2
            bloating += 2

        # Add noise
        energy += np.random.choice([-1,0,1], p=[0.15,0.7,0.15])
        mood += np.random.choice([-1,0,1], p=[0.15,0.7,0.15])

        energy = clamp(energy,1,5)
        mood = clamp(mood,1,5)
        bloating = clamp(bloating,0,5)
        cravings = clamp(cravings,0,5)

        data.append([
            user_id,
            cycle_length,
            day,
            sleep,
            energy,
            mood,
            bloating,
            cravings,
            phase
        ])

df = pd.DataFrame(
    data,
    columns=[
        "user_id",
        "cycle_length",
        "cycle_day",
        "sleep_quality",
        "energy",
        "mood",
        "bloating",
        "cravings",
        "phase"
    ]
)
'''
df.to_csv(
    "rhythm_synthetic_data.csv",
    index=False
)

print(df.shape)
print(df.head())
'''

print(df["phase"].value_counts())

print(
    df.groupby("phase")[
        ["energy","mood","bloating","cravings"]
    ].mean()
)