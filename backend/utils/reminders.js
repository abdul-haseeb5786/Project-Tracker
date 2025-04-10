import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Task from '../models/Task.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Daily reminder check at 9 AM
cron.schedule('0 9 * * *', async () => {
  const tasks = await Task.find({
    dueDate: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) }
  }).populate('createdBy', 'email');

  tasks.forEach(task => {
    transporter.sendMail({
      from: `"Task Tracker" <${process.env.EMAIL}>`,
      to: task.createdBy.email,
      subject: `⏰ Reminder: ${task.title}`,
      text: `Aapka task "${task.title}" kal tak khatam hona hai!`
    });
  });
});