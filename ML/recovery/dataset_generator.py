import pandas as pd
from generate_recovery_data import generate_features


NUM_SAMPLES = 20000

def generate_dataset(num_samples=NUM_SAMPLES):
    data = []

    for i in range(num_samples):
        data.append(generate_features())

        if (i + 1) % 1000 == 0:
            print(f"Generated {i + 1}/{num_samples} samples")

    df = pd.DataFrame(data)

    return df


if __name__ == "__main__":
    df = generate_dataset()

    print("\nDataset Shape:")
    print(df.shape)

    print("\nFirst 5 Rows:")
    print(df.head())

    print("\nSummary Statistics:")
    print(df.describe())

    print("\nPhase Distribution:")
    print(df["phase"].value_counts(normalize=True))

    output_file = "recovery_dataset.csv"
    df.to_csv(output_file, index=False)

    print(f"\nDataset saved as '{output_file}'")