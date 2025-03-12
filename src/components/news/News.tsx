import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Tabs,
  Tab,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  CardMedia,
  CardActions,
  Button,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  FilterList as FilterListIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import { mockNews } from '../../services/mockData';
import { NewsArticle } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`news-tabpanel-${index}`}
      aria-labelledby={`news-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const News: React.FC = () => {
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSaveArticle = (articleId: string) => {
    if (savedArticles.includes(articleId)) {
      setSavedArticles(savedArticles.filter((id) => id !== articleId));
    } else {
      setSavedArticles([...savedArticles, articleId]);
    }
  };

  // Filter news by category and search query
  const filteredNews = mockNews
    .filter((article) => {
      // Filter by category
      if (tabValue === 0) return true; // All news
      if (tabValue === 1) return article.category === 'company';
      if (tabValue === 2) return article.category === 'market';
      if (tabValue === 3) return article.category === 'economic';
      if (tabValue === 4) return article.category === 'global';
      if (tabValue === 5) return article.category === 'industry';
      return false;
    })
    .filter((article) => {
      // Filter by search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        (article.relatedSymbols &&
          article.relatedSymbols.some((symbol) =>
            symbol.toLowerCase().includes(query)
          ))
      );
    });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Market News
      </Typography>

      <Grid container spacing={3}>
        {/* News Filters */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    sx={{ mr: 1 }}>
                    Filters
                  </Button>
                  <Button variant="outlined" startIcon={<CalendarMonthIcon />}>
                    Date Range
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="news categories"
                variant="scrollable"
                scrollButtons="auto">
                <Tab label="All News" />
                <Tab label="Company Updates" />
                <Tab label="Market Analysis" />
                <Tab label="Economic Indicators" />
                <Tab label="Global News" />
                <Tab label="Industry News" />
              </Tabs>
            </Box>
          </Card>
        </Grid>

        {/* News Articles */}
        <Grid item xs={12}>
          <TabPanel value={tabValue} index={0}>
            <NewsGrid
              news={filteredNews}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <NewsGrid
              news={filteredNews}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <NewsGrid
              news={filteredNews}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <NewsGrid
              news={filteredNews}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <NewsGrid
              news={filteredNews}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <NewsGrid
              news={filteredNews}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
            />
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

interface NewsGridProps {
  news: NewsArticle[];
  savedArticles: string[];
  onSaveArticle: (articleId: string) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({
  news,
  savedArticles,
  onSaveArticle,
}) => {
  const theme = useTheme();

  if (news.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No news articles found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search or filters to find more articles.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {news.map((article) => (
        <Grid item xs={12} md={6} lg={4} key={article.id}>
          <Card elevation={2}>
            <CardMedia
              component="img"
              height="140"
              image={article.imageUrl || 'https://via.placeholder.com/300x140'}
              alt={article.title}
            />
            <CardHeader
              title={article.title}
              subheader={`${article.source} • ${new Date(
                article.publishedAt
              ).toLocaleDateString()}`}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {article.summary}
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={
                    article.category.charAt(0).toUpperCase() +
                    article.category.slice(1)
                  }
                  size="small"
                  color={
                    article.category === 'company'
                      ? 'primary'
                      : article.category === 'market'
                      ? 'success'
                      : article.category === 'economic'
                      ? 'info'
                      : article.category === 'global'
                      ? 'warning'
                      : 'secondary'
                  }
                />
                {article.relatedSymbols &&
                  article.relatedSymbols.map((symbol) => (
                    <Chip
                      key={symbol}
                      label={symbol}
                      size="small"
                      variant="outlined"
                    />
                  ))}
              </Box>
            </CardContent>
            <CardActions disableSpacing>
              <Button
                size="small"
                color="primary"
                href={article.url}
                target="_blank">
                Read More
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                aria-label="share article"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.summary,
                      url: article.url,
                    });
                  }
                }}>
                <ShareIcon />
              </IconButton>
              <IconButton
                aria-label={
                  savedArticles.includes(article.id)
                    ? 'unsave article'
                    : 'save article'
                }
                onClick={() => onSaveArticle(article.id)}
                color={
                  savedArticles.includes(article.id) ? 'primary' : 'default'
                }>
                {savedArticles.includes(article.id) ? (
                  <BookmarkIcon />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default News;
