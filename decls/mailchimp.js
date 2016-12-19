// @flow
/* eslint-disable no-undef */

declare type MClink = {
  rel: string,
  href: string,
  method: 'GET' | 'POST',
  targetSchema?: string,
  schema?: string,
};

declare type MCcampaign = {
  id: string,
  type: string,
  create_time: Date,
  archive_url: string,
  long_archive_url: string,
  status: 'sent',
  emails_sent: number,
  send_time: Date,
  content_type: 'template',
  recipients: {
    list_id: string,
    list_name: string,
    segment_text: string,
    recipient_count: number,
  },
  settings: {
    subject_line: string,
    title: string,
    from_name: string,
    reply_to: string,
    use_conversation: boolean,
    to_name: string,
    folder_id: string,
    authenticate: boolean,
    auto_footer: boolean,
    inline_css: boolean,
    auto_tweet: boolean,
    fb_comments: boolean,
    timewarp: boolean,
    template_id: number,
    drag_and_drop: boolean,
  },
  tracking: {
    opens: boolean,
    html_clicks: boolean,
    text_clicks: boolean,
    goal_tracking: boolean,
    ecomm360: boolean,
    google_analytics: string,
    clicktale: string,
  },
  report_summary: {
    opens: number,
    unique_opens: number,
    open_rate: number,
    clicks: number,
    subscriber_clicks: number,
    click_rate: number,
    ecommerce: Object,
  },
  delivery_status: { enabled: boolean },
  _links: Array<MClink>,
};

declare type MCreport = {
  id: string,
  campaign_title: string,
  type: 'regular',
  list_id: string,
  list_name: string,
  subject_line: string,
  emails_sent: number,
  abuse_reports: number,
  unsubscribed: number,
  send_time: Date,
  bounces: { hard_bounces: number, soft_bounces: number, syntax_errors: number },
  forwards: { forwards_count: number, forwards_opens: number },
  opens: {
    opens_total: number,
    unique_opens: number,
    open_rate: number,
    last_open: Date,
  },
  clicks: {
    clicks_total: number,
    unique_clicks: number,
    unique_subscriber_clicks: number,
    click_rate: number,
    last_click: Date,
  },
  facebook_likes: { recipient_likes: number, unique_likes: number, facebook_likes: number },
  industry_stats: {
    type: string,
    open_rate: number,
    click_rate: number,
    bounce_rate: number,
    unopen_rate: number,
    unsub_rate: number,
    abuse_rate: number,
  },
  list_stats: {
    sub_rate: number,
    unsub_rate: number,
    open_rate: number,
    click_rate: number,
  },
  timeseries: Array<any>,
  share_report: {
    share_url: string,
    share_password: string,
  },
  ecommerce: { total_orders: number, total_spent: number, total_revenue: number },
  delivery_status: { enabled: boolean },
  _links: Array<MClink>,
};
