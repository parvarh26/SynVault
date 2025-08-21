import { Card, CardContent, Typography, FormControlLabel, Switch } from '@mui/material'

export default function Settings() {
  return (
    <div className="space-y-4">
      <Typography variant="h5" className="text-midnight dark:text-slate-100 font-bold">Settings</Typography>
      <Card className="card-base">
        <CardContent className="space-y-2">
          <Typography className="text-sm text-coolgray dark:text-slate-300">Preferences</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
        </CardContent>
      </Card>
    </div>
  )
}


