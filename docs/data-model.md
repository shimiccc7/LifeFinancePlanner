# Data Model (prototype)

All v0.x user data is local-only.

```js
{
  income: number,
  monthlyExpenses: {
    mortgage: number,
    education: number,
    transport: number,
    loans: number,
    living: number,
    insurance: number,
    other: number
  },
  goals: {
    travelAnnualTarget: number,
    travelCurrent: number,
    travelMonthly: number,
    emergencyMonthly: number,
    diversifiedInvestingMonthly: number
  },
  espp: { contributionPercent: number },
  quests: boolean[]
}
```

Do not store account numbers, credentials, tax IDs, brokerage credentials, or bank secrets in localStorage.
